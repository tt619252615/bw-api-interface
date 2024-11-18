const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Ajv = require('ajv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');


// 加密相关函数
function sig(L) {
    for (var N = 0, g = encodeURIComponent(L), B = 0; B < g.length; B++)
        N = (((N << 7) - N) + 398) + g.charCodeAt(B), N |= 0;
    return N;
}

function uu(E, H, W) {
    if (null == E) return '';
    for (var P, M, K, V, L = {}, N = {}, B = '', Q = 2, R = 3, I = 2, T = [], w = 0, k = 0, v = 0; v < E.length; v += 1)
        if (K = E.charAt(v),
            Object.prototype.hasOwnProperty.call(L, K) || (L[K] = R++,
                N[K] = true),
            V = B + K,
            Object.prototype.hasOwnProperty.call(L, V))
            B = V;
        else {
            if (Object.prototype.hasOwnProperty.call(N, B)) {
                if (B.charCodeAt(0) < 256) {
                    for (P = 0; P < I; P++)
                        w <<= 1, k == H - 1 ? (k = 0,
                            T.push(W(w)),
                            w = 0) : k++;
                    for (M = B.charCodeAt(0), P = 0; P < 8; P++)
                        w = w << 1 | 1 & M,
                            k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
                } else {
                    for (M = 1, P = 0; P < I; P++)
                        w = w << 1 | M, k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M = 0;
                    for (M = B.charCodeAt(0), P = 0; P < 16; P++)
                        w = w << 1 | 1 & M, k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
                }
                0 == --Q && (Q = Math.pow(2, I), I++), delete N[B];
            } else {
                for (M = L[B], P = 0; P < I; P++)
                    w = w << 1 | 1 & M,
                        k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
            }
            0 == --Q && (Q = Math.pow(2, I), I++),
                L[V] = R++,
                B = String(K);
        }
    if ('' !== B) {
        if (Object.prototype.hasOwnProperty.call(N, B)) {
            if (B.charCodeAt(0) < 256) {
                for (P = 0; P < I; P++)
                    w <<= 1, k == H - 4097 ? (k = 0, T.push(W(w)),
                        w = 0) : k++;
                for (M = B.charCodeAt(0), P = 0; P < 8; P++)
                    w = w << 1 | 1 & M,
                        k == H - 1 ? (k = 0,
                            T.push(W(w)), w = 0) : k++, M >>= 1;
            } else {
                for (M = 1, P = 0; P < I; P++)
                    w = w << 1 | M, k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M = 0;
                for (M = B.charCodeAt(0), P = 0; P < 16; P++)
                    w = w << 1 | 1 & M,
                        k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
            }
            0 == --Q && (Q = Math.pow(2, I), I++), delete N[B];
        } else {
            for (M = L[B], P = 0; P < I; P++)
                w = w << 1 | 1 & M,
                    k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
        }
        0 == --Q && (Q = Math.pow(2, I), I++);
    }
    for (M = 2, P = 0; P < I; P++)
        w = w << 1 | 1 & M,
            k == H - 1 ? (k = 0, T.push(W(w)), w = 0) : k++, M >>= 1;
    for (; ;) {
        if (w <<= 1, k == H - 1) {
            T.push(W(w));
            break;
        }
        k++;
    }
    return T.join('');
}

function ua(E, H) {
    var W = ['3', '4', '2', '1', '0'],
        P = 0;
    while (!![]) {
        switch (W[P++]) {
            case '0':
                switch (M.length % 4) {
                    default:
                    case 0:
                        return M;
                    case 1:
                        return M + '===';
                    case 2:
                        return M + '==';
                    case 3:
                        return M + '=';
                }
                continue;
            case '1':
                if (H)
                    return M;
                continue;
            case '2':
                var M = uu(E, 6, function (L) {
                    return V.uGGDj.charAt(L);
                });
                continue;
            case '3':
                var K = {};
                K.uGGDj = 'DGi0YA7BemWnQjCl4+bR3f8SKIF9tUz/xhr2oEOgPpac=61ZqwTudLkM5vHyNXsVJ';
                var V = K;
                continue;
            case '4':
                if (null == E)
                    return '';
                continue;
        }
        break;
    }
}

function type__1475(N) {
    var g = 'https://miniapp.qmai.cn/web/cmk-center/receive/takePartInReceive'
    g += N;
    N = (((((sig(g) + '|') + 0) + '|') + new Date().getTime()) + '|1'), g = ua(N, true)
    return encodeURIComponent(g);
}

// 请求schema
const encryptSchema = {
    type: 'object',
    required: ['activityId', 'keyWords', 'qzGtd', 'gdtVid', 'appid', 'timestamp', 'signature', 'data', 'version'],
    properties: {
        activityId: { type: 'string', minLength: 1 },
        keyWords: { type: 'string' },
        qzGtd: { type: 'string' },
        gdtVid: { type: 'string' },
        appid: { type: 'string', minLength: 1 },
        timestamp: { type: 'string' },
        signature: { type: 'string', minLength: 32 },
        data: { type: 'string' },
        version: { type: 'string' }
    }
};

const ajv = new Ajv();
const validateRequest = ajv.compile(encryptSchema);

const app = express();
app.use(express.json());

app.post('/api/encrypt', (req, res) => {
    console.log('Request received:', {
        path: '/api/encrypt',
        body: req.body,
        timestamp: new Date().toISOString()
    });

    if (!validateRequest(req.body)) {
        console.log('Validation failed:', validateRequest.errors);
        return res.status(400).json({
            code: 400,
            msg: '参数错误',
            errors: validateRequest.errors
        });
    }

    try {
        const encryptedData = {
            encrypted: type__1475(JSON.stringify(req.body)),
            timestamp: Date.now()
        };

        console.log('Response:', {
            code: 0,
            data: encryptedData,
            timestamp: new Date().toISOString()
        });

        res.json({
            code: 0,
            msg: 'success',
            data: encryptedData
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            code: 500,
            msg: '加密失败'
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
