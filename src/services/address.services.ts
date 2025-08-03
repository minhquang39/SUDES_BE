import { get } from "http";
import Address from "../models/address.model";
import User from "../models/user.model";
import { ErrorCode } from "../utils/errorCodes";
const createAddressService = async (userId: string | any, data: any) => {
  const {
    full_name,
    phone,
    email,
    address_line,
    province,
    district,
    ward,
    is_default = true,
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

    return [defaultAddress, address];
  } catch (error) {
    throw {
      code: ErrorCode.SERVER_ERROR,
      message: "Failed to create address",
    };
  }
};

const deleteAddressService = async (
  userId: string | any,
  addressId: string | any
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

const updateAddressService = async (
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

    const {
      email,
      name,
      phone,
      address_line,
      province,
      district,
      ward,
      is_default,
    } = data;
    let defaultAddress = await Address.findOne({
      is_default: true,
    });
    if (is_default && defaultAddress) {
      defaultAddress.is_default = false;
      await defaultAddress.save();
    }
    const updateAddress = await Address.findByIdAndUpdate(addressId, data, {
      new: true,
    });
    console.log("defaultAddress: ", defaultAddress);
    console.log("upateAddress: ", updateAddress);
    return [defaultAddress, updateAddress];
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Failed to update address" };
  }
};
const getAddressService = async (userId: string | any) => {
  try {
    const address = await Address.find({ userId });
    return address;
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Failed to get address" };
  }
};
export default {
  createAddressService,
  deleteAddressService,
  updateAddressService,
  getAddressService,
};
