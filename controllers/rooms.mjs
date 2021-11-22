export default function initRoomsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Room.findAll();
      response.send({ items });
    } catch (error) {
      console.log(error);
    }
  };

  const create = async (request, response) => {};
  const show = async (request, response) => {};
  return {
    index,
    create,
    show,
  };
}
