export default function initAvatarsController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.Avatar.findAll();
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
