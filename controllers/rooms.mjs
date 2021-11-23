import { checkError } from './utils.mjs';

export default function initRoomsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Room.findAll();
      response.send({ items });
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
  const show = async (request, response) => {};
  return {
    index,
    create,
    show,
  };
}
