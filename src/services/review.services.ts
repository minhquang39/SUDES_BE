import Order from "../models/order.model";
import Review from "../models/review.model";
import Product from "../models/product.model";
const getReviewableProductsService = async (userId: string) => {
  try {
    const reviewableItems = [];

    const completedOrders = await Order.find({
      user: userId,
      orderStatus: "completed",
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    for (const order of completedOrders) {
      for (const item of order.items) {
        if (!item.isReviewed) {
          const existingReview = await Review.findOne({
            user: userId,
            product: (item.product as any)._id,
            order: order._id,
            SKU: item.SKU,
          });

          if (!existingReview) {
            reviewableItems.push({
              orderId: order._id.toString(),
              productId: (item.product as any)._id.toString(),
              productName: (item.product as any).name,
              productImage:
                (item.product as any).images &&
                (item.product as any).images.length > 0
                  ? (item.product as any).images[0]
                  : "",
              SKU: item.SKU,
              productSlug: (item.product as any).slug,
              quantity: item.quantity,
              price: item.price,
              orderDate: order.createdAt,
            });
          }
        }
      }
    }

    return reviewableItems;
  } catch (error) {
    console.error("Error in getReviewableProductsService:", error);
    throw new Error("Failed to retrieve reviewable products");
  }
};

const postReviewProductService = async (userId: string, data: any) => {
  try {
    const { productId, SKU, orderId, rating, comment } = data;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new Error("Order not found or does not belong to the user");
    }

    if (order.orderStatus !== "completed") {
      throw new Error("Order is not completed");
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId,
      SKU,
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const newReview = new Review({
      user: userId,
      product: productId,
      SKU,
      order: orderId,
      rating,
      comment,
    });
    await newReview.save();

    await Order.updateOne(
      { _id: orderId, "items.product": productId },
      { $set: { "items.$.isReviewed": true } }
    );

    const productReviews = await Review.find({ product: productId });
    const totalRating = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      productReviews.length > 0 ? totalRating / productReviews.length : 0;

    await Product.findByIdAndUpdate(
      productId,
      {
        rating: averageRating, // Cập nhật trường 'rating' (điểm trung bình)
        reviews: productReviews.length, // Cập nhật trường 'reviews' (số lượng đánh giá)
      },
      { new: true } // Trả về document đã cập nhật
    );
    return newReview;
  } catch (error) {
    console.error("Error in postReviewProductService:", error);
    throw new Error("Failed to submit product review");
  }
};

const getReviewProductService = async (userId: string) => {
  try {
    const reviews = await Review.find({ user: userId })
      .populate("product")
      .populate("order")
      .sort({ createdAt: -1 });

    return reviews.map((review) => {
      const orderItem = (review.order as any).items?.find(
        (item: any) => item.SKU === review.SKU
      );

      console.log("orderItem:", orderItem);

      return {
        id: review._id.toString(),
        productId: (review.product as any)._id.toString(),
        productName: (review.product as any).name,
        productImage:
          (review.product as any).images &&
          (review.product as any).images.length > 0
            ? (review.product as any).images[0]
            : "",
        orderId: (review.order as any)._id.toString(),
        SKU: review.SKU,
        price: orderItem?.price || 0,
        quantity: orderItem?.quantity || 0,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      };
    });
  } catch (error) {
    console.error("Error in getReviewProductService:", error);
    throw new Error("Failed to retrieve product reviews");
  }
};

const getProductReviewsService = async (
  productId: string,
  page: number,
  limit: number
) => {
  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "first_name last_name email avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ product: productId });

    return {
      reviews: reviews.map((review) => {
        return {
          id: review._id.toString(),
          productId: review.product.toString(),
          userId: (review.user as any)._id.toString(),
          userName: `${(review.user as any).first_name} ${
            (review.user as any).last_name
          }`,
          userEmail: (review.user as any).email,
          userAvatar: (review.user as any).avatar,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        };
      }),
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in getProductReviewsService:", error);
    throw new Error("Failed to retrieve product reviews");
  }
};

export default {
  getReviewableProductsService,
  postReviewProductService,
  getReviewProductService,
  getProductReviewsService,
};
