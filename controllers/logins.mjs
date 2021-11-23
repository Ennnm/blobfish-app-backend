import * as validation from './validation.mjs';
import * as util from './utils.mjs';
import * as globals from './globals.mjs';

export default function initLoginController(db) {
  const create = async (request, response) => {
    const userInfo = request.body;
    const validatedLogin = validation.validateLogin(userInfo);
    const invalidRequests = util.getInvalidFormRequests(validatedLogin);
    try {
      if (invalidRequests.length > 0) {
        throw new Error(globals.INVALID_LOGIN_REQUEST_MESSAGE);
      }

      const { username } = validatedLogin;
      const user = await db.User.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        // we didnt find a user with that email.
        // the error for password and user are the same.
        // don't tell the user which error they got for security reasons,
        // otherwise people can guess if a person is a user of a given service.
        throw new Error(globals.LOGIN_FAILED_ERROR_MESSAGE);
      }

      // generate a hashed cookie string using SHA object
      const hashedCookieString = util.getHash(`${user.id}`);

      // set the loggedIn and userId cookies in the response
      // The user's password hash matches that in the DB and we authenticate the user.
      const successMessage = 'Login success!';
      response.send({
        id: user.id,
        hashedId: hashedCookieString,
        message: successMessage,
        username: user.username,
      });
    } catch (error) {
      let errorMessage = '';
      if (error.message === globals.LOGIN_FAILED_ERROR_MESSAGE) {
        errorMessage =
          'There has been an error. Please ensure that you have the correct username or password.';
      } else if (error.message === globals.INVALID_LOGIN_REQUEST_MESSAGE) {
        errorMessage =
          'There has been an error. Login input validation failed!';
      } else {
        errorMessage = error.message;
      }

      const resObj = {
        error: errorMessage,
        message: errorMessage,
        ...validatedLogin,
      };
      delete resObj.password;
      response.send(resObj);
    }
  };

  const destroy = (request, response) => {
    response.clearCookie('userId');
    response.clearCookie('loggedIn');
    response.send({
      message: 'Logout success!',
    });
  };

  return {
    create,
    destroy,
  };
}
