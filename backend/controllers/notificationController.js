import pool from "../config/pgConfig.js";
export const getAllNotifications = async (req, res) => {
  const { userId, page = 1, limit = 10, type, sort = 'desc' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const typeCondition = type ? "AND n.type = $2::text" : "";
    const params = [userId, ...(type ? [type] : [])];

    // Queries
    const queries = {
      unread: `
        SELECT n.*, un.is_read, un.timestamp AS read_timestamp
        FROM notifications n
        JOIN users_notifications un ON n.notification_id = un.notification_id
        WHERE un.user_id = $1
        AND un.is_read = false
        ${typeCondition}
        ORDER BY n.timestamp ${sort.toUpperCase()}
      `,
      read: `
        SELECT n.*, un.is_read, un.timestamp AS read_timestamp
        FROM notifications n
        JOIN users_notifications un ON n.notification_id = un.notification_id
        WHERE un.user_id = $1
        AND un.is_read = true
        ${typeCondition}
        ORDER BY n.timestamp ${sort.toUpperCase()}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      count: `
        SELECT COUNT(*) 
        FROM notifications n
        JOIN users_notifications un ON n.notification_id = un.notification_id
        WHERE un.user_id = $1
        AND un.is_read = true
        ${typeCondition}
      `,
    };

    // Add pagination params for read notifications
    const readParams = [...params, limit, offset];

    // Execute queries
    const [unreadResult, readResult, countResult] = await Promise.all([
      pool.query(queries.unread, params),
      pool.query(queries.read, readParams),
      pool.query(queries.count, params),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    res.json({
      unread_notifications: unreadResult.rows,
      read_notifications: {
        data: readResult.rows,
        total,
        total_pages: totalPages,
        current_page: page,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllUnreadNotifications = async (req, res) => {
  const { user_id } = req.body;  // Destructure to extract user_id from the request body

  try {
    const result = await pool.query(
      `SELECT un.notification_id, un.user_id, un.is_read, un.timestamp, n.message, n.type 
       FROM users_notifications un
       JOIN notifications n ON un.notification_id = n.notification_id
       WHERE un.user_id = $1 AND un.is_read = false
       ORDER BY un.timestamp DESC`,
      [user_id]  // Use user_id to fetch the unread notifications
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "No unread messages" });
    }

    return res.status(200).json({ notifications: result.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  const { notificationId, userId } = req.body;  // Extract notificationId and userId from the request body

  try {
    const result = await pool.query(
      `UPDATE users_notifications
         SET is_read = true
         WHERE notification_id = $1 AND user_id = $2
         RETURNING *`,
      [notificationId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No notifications found to update",
      });
    }

    return res.status(200).json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
