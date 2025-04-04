import slugify from "slugify";
import Policy from "../models/policy.model";
import { ErrorCode } from "../utils/errorCodes";
const createPolicyService = async (data: any) => {
  const { title, content } = data;
  try {
    const slug = slugify(title, { lower: true });
    const existingPolicy = await Policy.findOne({ slug });
    if (existingPolicy) {
      throw {
        message: "Policy already exists",
        code: ErrorCode.POLICY_ALREADY_EXISTS,
      };
    }
    const policy = await Policy.create({ title, content, slug });
    return policy;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code,
    };
  }
};

const getPoliciesService = async () => {
  try {
    const policies = await Policy.find();
    return policies;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code,
    };
  }
};

const getPolicyByIdService = async (slug: string) => {
  try {
    const policy = await Policy.findOne({ slug });
    if (!policy) {
      throw {
        message: "Policy not found",
        code: ErrorCode.POLICY_NOT_FOUND,
      };
    }
    return policy;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code,
    };
  }
};

const deletePolicyService = async (id: string) => {
  try {
    const policy = await Policy.findOneAndDelete({ slug: id });
    if (!policy) {
      throw {
        message: "Policy not found",
        code: ErrorCode.POLICY_NOT_FOUND,
      };
    }
    return policy;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code,
    };
  }
};

const updatePolicyService = async (id: string, data: any) => {
  try {
    const policy = await Policy.findOneAndUpdate({ slug: id }, data, {
      new: true,
    });
    if (!policy) {
      throw {
        message: "Policy not found",
        code: ErrorCode.POLICY_NOT_FOUND,
      };
    }
    return policy;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code,
    };
  }
};

export default {
  createPolicyService,
  getPoliciesService,
  getPolicyByIdService,
  deletePolicyService,
  updatePolicyService,
};
