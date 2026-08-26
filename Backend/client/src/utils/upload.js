import axios from "axios";

const upload = async (file) => {
  const uploadLink = import.meta.env.VITE_UPLOAD_LINK;
  if (!file || !uploadLink || uploadLink.includes("replace-cloud-name")) {
    return "";
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post(uploadLink, data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;
