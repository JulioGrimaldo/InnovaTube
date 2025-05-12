const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const verifyToken = (req, res, next) => {
  // 1. Compatibilidad con headers Authorization y authorization
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  // 2. Extracción segura del token (manteniendo tu formato)
  const token = authHeader?.split(" ")[1]; // Usamos ?. para evitar errores si authHeader es undefined

  // 3. Validación del token (igual que tu versión original)
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token no proporcionado",
    });
  }

  try {
    // 4. Verificación del token (igual que tu versión)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Asignación a req.user (manteniendo tu estructura)
    req.user = decoded;

    // 6. Debugging opcional (nueva mejora)
    if (process.env.NODE_ENV === "development") {
      console.log(`Usuario autenticado: ${decoded.username || decoded.id}`);
    }

    next();
  } catch (err) {
    // 7. Manejo de errores mejorado (manteniendo compatibilidad)
    const errorResponse = {
      success: false,
      error: "Token inválido o expirado",
    };

    // 8. Información adicional solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      errorResponse.details = {
        type: err.name,
        message: err.message,
        expiredAt: err.expiredAt,
      };
      console.error("Error de verificación de token:", err);
    }

    res.status(403).json(errorResponse);
  }
};

module.exports = verifyToken;
