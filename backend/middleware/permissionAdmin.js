const permissionAdmin = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const admin = req.admin;

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Admin not authenticated",
                });
            }

            // 👑 SuperAdmin → full access
            if (admin.role === "SuperAdmin") {
                return next();
            }

            // 🧑‍💼 Normal admin permission check
            if (!Array.isArray(admin.permissions) ||
                !admin.permissions.includes(requiredPermission)
            ) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied: ${requiredPermission} permission required`,
                });
            }

            next();
        } catch (error) {
            console.error("Permission middleware error:", error.message);
            res.status(500).json({
                success: false,
                message: "Permission check failed",
            });
        }
    };
};

export default permissionAdmin;