var mongoose = require('mongoose');

var PicNotification = mongoose.model('PicNotification');

var constantData = require('../../../config/constantData');

var sendJSONresponse = function(res, status, content) {
  res.status(status);

  res.json(content);
};

/**


* Save each notification depending on the application in network


* @method savePicNotifications


* @param {Object} data


*/

module.exports.savePicNotifications = async data => {
  let objNotification = {
    type: data.type,

    byUser: data.currentUser,

    byAccount: data.currentAccount,

    organizationPic: data.owner,

    content: data.message,

    isComment: data.isComment,

    createdAt: Date.now()
  };

  if (objNotification.type == constantData.NETWORK_APP.CHANNEL) {
    objNotification['channel'] = data.channel;
  }

  let picNotification = new PicNotification(objNotification);

  try {
    let savedNotifcation = await picNotification.save();

    return savedNotifcation;
  } catch (error) {
    console.log(error);
  }
};

/***


* Get Pic Notification ByUser Id


* @param userId User Id


*/

module.exports.getLastPicNotificationByUserId = async (req, res) => {
  try {
    let userId = req.query.userId;

    let notifications = await PicNotification.find({ byUser: mongoose.Types.ObjectId(userId) })

      .limit(15)

      .sort({ createdAt: -1 })

      .populate('byUser byAccount organizationPic');

    sendJSONresponse(res, 200, {
      status: 'OK',

      data: notifications
    });
  } catch (error) {
    console.log(error);

    sendJSONresponse(res, 500, {
      status: 'NOK',

      message: 'Error server'
    });
  }
};

module.exports.getLastPicNotificationCountByOrganization = async (req, res) => {
  try {
    let organizationId = req.query.organizationId;

    let notifications = await PicNotification.find({
      byAccount: mongoose.Types.ObjectId(organizationId)
    })

      .limit(10)

      .sort({ createdAt: -1 })

      .count();

    sendJSONresponse(res, 200, {
      status: 'OK',

      data: notifications
    });
  } catch (error) {
    console.log(error);

    sendJSONresponse(res, 500, {
      status: 'NOK',

      message: 'Error server'
    });
  }
};
