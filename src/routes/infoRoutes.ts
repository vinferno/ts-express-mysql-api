import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        home: {url: '/', text: 'lists all routes'},
        users: {url: '/api/users', text: 'list all users'},
        resetDB: {url: '/reset/db', text: 'reset db with original data'}
    })
});

export default router;