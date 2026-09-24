import FoodItem from '../models/FoodItem.js';
import Category from '../models/Category.js';

// @desc    Get all active categories
// @route   GET /api/foods/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/foods/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image, displayOrder } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'Utensils',
      image: image || '',
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food items with filter, search & sorting
// @route   GET /api/foods
// @access  Public
export const getFoodItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      dietary,
      minPrice,
      maxPrice,
      isFeatured,
      sort,
      page = 1,
      limit = 50,
      includeUnavailable,
    } = req.query;

    const query = {};

    // Filter by availability unless admin requests all
    if (includeUnavailable !== 'true') {
      query.isAvailable = true;
    }

    // Search keyword
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { ingredients: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      // Find category by slug or ID
      const cat = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Dietary filter (e.g. 'vegan', 'gluten-free', 'spicy')
    if (dietary && dietary !== 'all') {
      const dietaryArray = dietary.split(',').map((d) => d.trim().toLowerCase());
      query.dietary = { $in: dietaryArray };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured items
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { isFeatured: -1, rating: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [foods, total] = await Promise.all([
      FoodItem.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      FoodItem.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: foods.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      foods,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food item details
// @route   GET /api/foods/:id
// @access  Public
export const getFoodItemById = async (req, res, next) => {
  try {
    const food = await FoodItem.findById(req.params.id).populate('category', 'name slug');
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }
    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create food item (Admin)
// @route   POST /api/foods
// @access  Private/Admin
export const createFoodItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      category,
      image,
      dietary,
      prepTime,
      calories,
      isAvailable,
      isFeatured,
      ingredients,
    } = req.body;

    const targetCategoryId = categoryId || category;
    const cat = await Category.findById(targetCategoryId);
    if (!cat) {
      return res.status(400).json({
        success: false,
        message: 'Valid Category is required',
      });
    }

    const food = await FoodItem.create({
      name,
      description,
      price: Number(price),
      category: cat._id,
      categoryName: cat.name,
      image,
      dietary: dietary || [],
      prepTime: prepTime || 20,
      calories: calories || 0,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      ingredients: ingredients || [],
    });

    const populatedFood = await FoodItem.findById(food._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food: populatedFood,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item (Admin)
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFoodItem = async (req, res, next) => {
  try {
    let food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    // If category is updated, update categoryName as well
    if (req.body.categoryId || req.body.category) {
      const catId = req.body.categoryId || req.body.category;
      const cat = await Category.findById(catId);
      if (cat) {
        req.body.category = cat._id;
        req.body.categoryName = cat.name;
      }
    }

    food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      food,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item (Admin)
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFoodItem = async (req, res, next) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    await FoodItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
