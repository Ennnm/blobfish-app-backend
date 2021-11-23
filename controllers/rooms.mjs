import { checkError } from './utils.mjs';

export default function initRoomsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Room.findAll({
        include: db.User,
        order: [['createdAt', 'DESC']],
      });
      const rooms = items.map((item) => ({
        id: item.id,
        name: item.name,
        capacity: item.capacity,
        username: item.user.username,
        uuid: item.key,
      }));
      response.send({ rooms });
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (request, response) => {
    const { userId, uuid, name } = request.body;
    try {
      const room = await db.Room.create({
        userId,
        key: uuid,
        name,
      });
      console.log('room in create room :>> ', room);
      response.send({ room });
    } catch (e) {
      console.log('error in creating room in db');
      checkError(e);
      response.status(500).send({ e });
    }
  };
  const destroy = async (request, response) => {
    const { id } = request.params;
    console.log('request.body :>> ', id);
    console.log(id);
    try {
      db.Room.destroy({
        where: {
          id,
        },
      });
      // const room = db.Room.findByPk(id);
      // room.destroy();
      response.send({ success: 'deletion a success' });
    } catch (e) {
      console.log('error in deleting room ');
      checkError(e);
      response.status(500).send({ e });
    }
  };
  const show = async (request, response) => {};
  return {
    index,
    create,
    show,
    destroy,
  };
}
