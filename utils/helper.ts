import CryptoJS from "crypto-js";
import jwt, { JwtPayload } from "jsonwebtoken";

const getBlurDataURL = () => {
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABdAF0DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAFxABAQEBAAAAAAAAAAAAAAAAAAERAv/EABgBAQEBAQEAAAAAAAAAAAAAAAIDAQAE/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERAv/aAAwDAQACEQMRAD8A9AjKucVTTtTa5xVFO1NrGlU0WlaxpAEcZQACF3lQm1Mhai07WfVZa3Bai0Ws7R0sVanU2jWa3FaNTo05RsUCBazHcVoTWVxWs+qrqsuqnacT1UWn1WdqV6OQ9Go0a6dNsXqtRKcUlCxY1JlrMdyaZU6nEdMumtZ9JdKRj0zrXqIsefqKxmcPBjOXU4ZGvApmQMXemmVVqSaixdTYnYcrKxFjaxFiNikrPCxpYWMkbqMCsJWQbSAB4Gu8jI0yqaqlRpxFhWKpVKnEWFYqprGppVVTVINSBSUgP//Z";
};

type ToastType = "success" | "error" | "info" | "warning";

const getToastType = (status: string | null): ToastType => {
  if (status === null) {
    return "info";
  }
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "info":
      return "info";
    case "warning":
      return "warning";
    default:
      return "info";
  }
};

const createHash = (data: string) => {
  console.log("createHash in helper :", data);

  return CryptoJS.SHA256(data).toString();
};

const createJWT = (userData: object) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET not defined");
  }
  try {
    const secretKey = process.env.JWT_SECRET || "your-secret";
    const token = jwt.sign(userData, secretKey, { expiresIn: "2h" });
    return token;
  } catch (err) {
    console.error("توکن معتبر نیست:", err);
    return null;
  }
};

interface DecodedToken extends JwtPayload {
  username: string;
}
const decodeJWT = (token: string): DecodedToken | null => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET not defined");
  }
  try {
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    return decoded;
  } catch (err) {
    console.error("توکن معتبر نیست:", err);
    return null;
  }
};

const generateRandomOTP = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

const checkDiscountStatus = (discount: {
  percent: number;
  start_time: string;
  end_time: string;
}): boolean => {
  const now = new Date();
  const startTime = new Date(discount.start_time);
  const endTime = new Date(discount.end_time);

  if (discount.percent === 0) {
    return false;
  } else {
    if (now < startTime) {
      return false;
    } else if (now >= startTime && now <= endTime) {
      return true;
    } else {
      return false;
    }
  }
};

export {
  getBlurDataURL,
  getToastType,
  createHash,
  createJWT,
  decodeJWT,
  generateRandomOTP,
  checkDiscountStatus,
};
