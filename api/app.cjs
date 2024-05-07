const express = require("express");
const https = require("https");
const cors = require("cors");

const app = express();

app.use(cors());

/**
 * Retrieves the list of files from the remote server.
 * @returns {Promise<string[]>}
 */
async function getFiles() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "echo-serv.tbxnet.com",
      path: "/v1/secret/files",
      method: "GET",
      headers: {
        authorization: "Bearer aSuperSecretKey",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data).files);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });
    req.end();
  });
}

/**
 * Retrieves the content of a specific file from the remote server.
 * @param {string} file
 * @returns {Promise<string>}
 */
async function getFileContent(file) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "echo-serv.tbxnet.com",
      path: `/v1/secret/file/${file}`,
      method: "GET",
      headers: {
        authorization: "Bearer aSuperSecretKey",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });
    req.end();
  });
}

/**
 * Processes the content of the files and extracts valid lines.
 * @param {string[]} files
 * @returns {Promise<Object[]>}
 */
async function processFiles(files) {
  const result = [];

  for (const file of files) {
    try {
      const content = await getFileContent(file);
      const lines = content.split("\n");
      const validLines = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const [fileField, text, number, hex] = line.split(",");

        if (fileField && text && number && hex && hex.length === 32) {
          validLines.push({ text, number: parseInt(number), hex });
        }
      }

      if (validLines.length > 0) {
        result.push({ file, lines: validLines });
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }

  return result;
}

// Route to retrieve the list of files
app.get("/files/list", async (req, res) => {
  try {
    const files = await getFiles();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to retrieve the processed data of file
app.get("/files/data", async (req, res) => {
  try {
    const fileName = req.query.fileName;
    if (!fileName) {
      const files = await getFiles();
      const data = await processFiles(files);
      res.json(data);
    } else {
      const data = await processFiles([fileName]);
      if (data.length === 0) {
        res.status(404).json({ error: "File not found" });
      } else {
        res.json(data[0]);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

module.exports = app;
