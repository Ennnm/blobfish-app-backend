export default function initUsersController(db) {
  const index = async (request, response) => {
    try {
      const items = await db.User.findAll();
      response.send({ items });
    } catch (error) {
      console.log(error);
    }
  };
  const show = async (request, response) => {};
  return {
    index,
    show,
  };
}
