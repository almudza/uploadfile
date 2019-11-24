import React, { Fragment, useState } from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("choose file");
  const [uploaded, setUploaded] = useState({});
  const [message, setMessage] = useState("");
  const [progressBar, setProgressBar] = useState(0);

  const handleChange = e => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },

        // Progreess bar loading
        onUploadProgress: progressEvent => {
          setProgressBar(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          // Clear Presentage
          setTimeout(() => setProgressBar(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploaded({ fileName, filePath });
      setMessage("File uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : ""}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            name="fileupload"
            id="fileUpload"
            onChange={handleChange}
          />
          <label htmlFor="fileUpload" className="custom-file-label">
            {" "}
            {filename}{" "}
          </label>
        </div>
        {progressBar ? <Progress percentage={progressBar} /> : ""}
        <input type="submit" className="btn btn-primary btn-block mt-4" />
      </form>
      {uploaded ? (
        <div className="row mt-5">
          <h3 className="text-center">
            <a target="/" href={uploaded.filePath}>
              {uploaded.fileName}
            </a>{" "}
          </h3>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default FileUpload;
