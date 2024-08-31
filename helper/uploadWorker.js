const { parentPort, workerData } = require('worker_threads');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const { Agent, User, UserAccount, PolicyCategory, PolicyCarrier, PolicyInfo } = require('../models/commonModel');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/insuremindDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Worker connected to MongoDB');
  } catch (error) {
    console.error('Worker MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB in worker');
  }
}

(async () => {
  try {
    await connectToDatabase();

    const filePath = workerData.filePath;
    const ext = path.extname(filePath);
    let data;

    if (ext === '.csv') {
      data = await processCSV(filePath);
    } else if (ext === '.xlsx') {
      data = await processXLSX(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    if (data.length > 0) {
      await saveToDatabase(data);
    }

    parentPort.postMessage('File processed successfully');
  } catch (error) {
    parentPort.postMessage(`Error: ${error.message}`);
  }
})();

async function processCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function processXLSX(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

async function saveToDatabase(data) {
  try {
    for (const item of data) {
      const agentItem = {
        agentName: item.agent,
      };
      let agentData = await Agent.findOne(agentItem);
      if (!agentData) {
        agentData = await Agent.create(agentItem);
      }

      const userItem = {
        firstName: item.firstname,
        email: item.email,
        gender: item.gender,
        city: item.city,
        phoneNumber: item.phone,
        address: item.address,
        state: item.state,
        zip: item.zip,
        dob: item.dob,
        userType: item.userType,
        agentId: agentData._id,
      };

      let userData = await User.findOne({firstName: new RegExp(item.firstname, 'g'), email: item.email});
      if (!userData) {
        userData = await User.create(userItem);
      }

      const userAccountItem = {
        accountName: item.account_name,
        userId: userData._id,
      };

      const userAccountData = await UserAccount.create(userAccountItem);

      let policyCategoryData = await PolicyCategory.findOne({categoryName: new RegExp(item.category_name, 'g')});
      if (!policyCategoryData) {
        policyCategoryData = await PolicyCategory.create({ categoryName: item.category_name });
      }

      let policyCarrierData = await PolicyCarrier.findOne({companyName: new RegExp(item.company_name, 'g')});
      if (!policyCarrierData) {
        policyCarrierData = await PolicyCarrier.create({ companyName: item.company_name });
      }

      const policyInfoItem = {
        policyNumber: item.policy_number,
        policyType: item.policy_type,
        premiumAmount: item.premium_amount,
        premiumAmountWritten: item.premiumAmountWritten || '',
        policyStartDate: moment(item.policy_start_date, 'YYYY-MM-DD'),
        policyEndDate: moment(item.policy_end_date, 'YYYY-MM-DD'),
        corporateSocialResponsibility: item.csr,
        policyCategory: policyCategoryData._id,
        policyCarrier: policyCarrierData._id,
        user: userData._id,
      };

      await PolicyInfo.create(policyInfoItem);
    }
  } catch (error) {
    console.log(error);
  }
}
