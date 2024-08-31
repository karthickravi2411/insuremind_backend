const mongoose = require('mongoose');
const { Schema } = mongoose;

// Agent Schema
const agentSchema = new Schema({
  agentName: {
    type: String,
  }
});

const Agent = mongoose.model('Agent', agentSchema);

// User Schema
const userSchema = new Schema({
  firstName: {
    type: String,
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  userType: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const User = mongoose.model('User', userSchema);

// User’s Account Schema
const userAccountSchema = new Schema({
  accountName: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const UserAccount = mongoose.model('UserAccount', userAccountSchema);

// Policy Category Schema
const policyCategorySchema = new Schema({
  categoryName: {
    type: String,
  }
});

const PolicyCategory = mongoose.model('PolicyCategory', policyCategorySchema);

// Policy Carrier Schema
const policyCarrierSchema = new Schema({
  companyName: {
    type: String,
  }
});

const PolicyCarrier = mongoose.model('PolicyCarrier', policyCarrierSchema);

// Policy Info Schema
const policyInfoSchema = new Schema({
  policyNumber: {
    type: String,
  },
  policyType: {
    type: String,
  },
  corporateSocialResponsibility: {
    type: String,
  },
  premiumAmount: {
    type: String,
  },
  premiumAmountWritten: {
    type: String,
  },
  policyStartDate: {
    type: Date,
  },
  policyEndDate: {
    type: Date,
  },
  policyCategory: {
    type: Schema.Types.ObjectId,
    ref: 'PolicyCategory',
  },
  policyCarrier: {
    type: Schema.Types.ObjectId,
    ref: 'PolicyCarrier',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

const PolicyInfo = mongoose.model('PolicyInfo', policyInfoSchema);

// Export models
module.exports = {
  Agent,
  User,
  UserAccount,
  PolicyCategory,
  PolicyCarrier,
  PolicyInfo
};
