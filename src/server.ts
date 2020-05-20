import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

import validator from 'validator';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage",
    async (req: Request, res: Response, next) => {
      if (!req.query || !req.query.image_url) {
        return res.status(400).send({ message: 'image_url query parameter neeeded!' });
      }

      const image_url = req.query.image_url
      if (!validator.isURL(image_url)) {
        return res.status(400).send({ message: 'proper url needed!' });
      }

      const filteredpath = await filterImageFromURL(image_url)
      if (filteredpath === "error") {
        return res.status(400).send({ message: 'url must be image!' });
      } else {
      return res.sendFile(filteredpath, function (err) {
        if (err) {
          next(err);
        } else {
          try {
            deleteLocalFiles([filteredpath])
          } catch (e) {
            console.log("error removing ", filteredpath);
          }
        }
      });}
    });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();