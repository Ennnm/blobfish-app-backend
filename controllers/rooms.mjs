export default function initRoomsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Room.findAll();
      response.send({ items });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
