export default function initAvatarsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Avatar.findAll();
      response.send({ items });
    } catch (error) {
      console.log(error);
    }
  };
  const create = async (request, response) => {
    try {
      let specs = {};
      switch (request.body.model) {
        case 'Blobfish':
          specs = {
            model: request.body.model,
            xAxis: request.body.xAxis,
            yAxis: request.body.yAxis,
            zAxis: request.body.zAxis,
            size: request.body.size,
          };
          break;
        case 'CubeHead':
          specs = {
            model: request.body.model,
            headHeight: request.body.headHeight,
            headWidth: request.body.headWidth,
            headLength: request.body.headLength,
            earLength: request.body.earLength,
            headColor: request.body.headColor,
            earColor: request.body.earColor,
            eyeColor: request.body.eyeColor,
          };
          break;
        default:
          return 'error';
      }
      const createAvatar = await db.Avatar.create({
        user_id: request.body.userId,
        name: request.body.name,
        specs,
      });
      response.send('success');
    }
    catch (error) {
      console.log(error);
    }
  };
  const show = async (request, response) => {
    try {
      const { id } = request.params;
      const userAvatars = await db.Avatar.findAll({
        where: {
          user_id: id,
        },
      });
      response.send(userAvatars);
    }
    catch (error) {
      console.log(error);
    }
  };
  const displayAvatar = async (request, response) => {
    try {
      console.log(request.body);
      const avatar = await db.Avatar.findOne({
        where: {
          id: request.body.avatarId,
          user_id: request.body.userId,
        },
      });
      console.log(avatar);
      response.send(avatar);
    }
    catch (error) {
      console.log(error);
    }
  };
  return {
    index,
    create,
    show,
    displayAvatar,
  };
}
