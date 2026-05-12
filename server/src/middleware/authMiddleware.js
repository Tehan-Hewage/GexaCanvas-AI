import { supabaseAuthClient } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    const { data: { user }, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};
