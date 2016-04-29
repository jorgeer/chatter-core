Chatter.Message = ChatterMessage = Astro.Class({
  name: "ChatterMessage",
  collection: new Mongo.Collection("chattermessage"),

  fields: {
    userId: {
      type: "string"
    },

    roomId: {
      type: "string"
    },

    message: {
      type: "string"
    }
  },

  validators: {

  },

  events: {
    beforeSave: function(e) {
      increaseCounter(this);
      updateRoom(this.roomId);
    }
  },

  methods: {
    timeAgo: function () {
      return moment(this.get("createdAt")).fromNow();
    }
  },

  behaviors: ["timestamp"]
});


const increaseCounter = function(message) {
  const userRooms = Chatter.UserRoom.find({"roomId": message.roomId, "userId": {$nin:[message.userId]}}).fetch();
  const users = userRooms.map(function(userRoom) {
    Chatter.UserRoom.update({
      roomId : userRoom.roomId,
      userId: userRoom.userId
    },
    {
      $inc: { count: 1}
    });
  });
};

const updateRoom = function(roomId) {
  Chatter.Room.update({
    _id : roomId
  },
  {
    $set:{lastActive : new Date()}
  });
};
