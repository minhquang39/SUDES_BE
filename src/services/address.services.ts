import Address from "../models/address.model";
import User from "../models/user.model";
import { ErrorCode } from "../utils/errorCodes";
const createAddress = async (userId: string | any, data: any) => {
  const {
    full_name,
    phone,
    email,
    address_line,
    province,
    district,
    ward,
    is_default,
  } = data;

  if (
    !full_name ||
    !phone ||
    !address_line ||
    !province ||
    !district ||
    !ward
  ) {
    throw {
      code: ErrorCode.MISSING_FIELDS,
      message: "All fields are required",
    };
  }

  try {
    const defaultAddress = await Address.findOne({
      is_default: true,
    });
    if (is_default && defaultAddress) {
      defaultAddress.is_default = false;
      await defaultAddress.save();
    }
    const address = await Address.create({
      userId,
      full_name,
      phone,
      email,
      address_line,
      province,
      district,
      ward,
      is_default,
    });
    await address.save();

    await User.findByIdAndUpdate(userId, {
      $push: { address: address._id },
    });

    return address;
  } catch (error) {
    throw {
      code: ErrorCode.SERVER_ERROR,
      message: "Failed to create address",
    };
  }
};

const deleteAddress = async (userId: string | any, addressId: string | any) => {
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      throw {
        code: ErrorCode.NOT_FOUND,
        message: "Address not found",
      };
    }
    if (address.userId.toString() !== userId) {
      throw {
        code: ErrorCode.FORBIDDEN,
        message: "You are not allowed to delete this address",
      };
    }
    await address.deleteOne();
    await User.findByIdAndUpdate(userId, {
      $pull: { address: addressId },
    });
    return address;
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Failed to delete address" };
  }
};

const updateAddress = async (
  userId: string | any,
  addressId: string | any,
  data: any
) => {
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      throw {
        code: ErrorCode.NOT_FOUND,
        message: "Address not found",
      };
    }
    if (address.userId.toString() !== userId) {
      throw {
        code: ErrorCode.FORBIDDEN,
        message: "You are not allowed to update this address",
      };
    }
    const updateAddress = async (
      userId: string | any,
      addressId: string | any,
      data: any
    ) => {
      try {
        // Tìm địa chỉ cần cập nhật
        let address = await Address.findById(addressId);

        if (!address) {
          throw {
            code: ErrorCode.NOT_FOUND,
            message: "Address not found",
          };
        }

        if (address.userId.toString() !== userId) {
          throw {
            code: ErrorCode.FORBIDDEN,
            message: "You are not allowed to update this address",
          };
        }

        // Kiểm tra và cập nhật địa chỉ mặc định nếu cần
        if (data.is_default) {
          // Tìm địa chỉ mặc định khác (nếu có) và bỏ is_default
          await Address.findOneAndUpdate(
            { is_default: true },
            { $set: { is_default: false } }
          );
        }

        // Cập nhật và lấy document mới (sử dụng findByIdAndUpdate + options)
        const updatedAddress = await Address.findByIdAndUpdate(
          addressId,
          { $set: data },
          { new: true } // Quan trọng: { new: true } sẽ trả về document đã được cập nhật
        );

        return updatedAddress; // Trả về địa chỉ đã cập nhật
      } catch (error) {
        console.error("Update address error:", error);
        throw {
          code: ErrorCode.SERVER_ERROR,
          message: "Failed to update address",
        };
      }
    };
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Failed to update address" };
  }
};

export default {
  createAddress,
  deleteAddress,
  updateAddress,
};
