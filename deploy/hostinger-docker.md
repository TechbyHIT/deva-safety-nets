# Hostinger VPS — Docker Manager deploy

## 1. DNS (required)

Point your domain **A record** to the VPS IP (e.g. `200.97.163.178`):

| Type | Name | Value |
|------|------|-------|
| A | `@` | VPS IP |
| A | `www` | VPS IP |

Remove Hostinger **parked domain** / parking page for `devasafetynets.com`.

## 2. Deploy in Docker Manager

1. Push latest `main` to GitHub.
2. Hostinger → VPS → **Docker Manager** → **Compose from URL**.
3. Paste:

   ```
   https://raw.githubusercontent.com/TechbyHIT/deva-safety-nets/main/docker-compose.yml
   ```

4. **Rebuild** the stack (not just restart) after every config change.
5. Map domain SSL/proxy to container port **3000**.

## 3. Verify

- Health: `http://YOUR_VPS_IP:3000/api/health` → `{"status":"ok"}`
- CSS loads: DevTools → Network → filter `css` → status **200** on `/_next/static/...`
- Images: Network → `/_next/image` or `/images/...` → **200**

## 4. Use HTTP until SSL is configured

Before TLS is active on the domain, open **`http://devasafetynets.com`** (not `https://`).

After Hostinger SSL / Cloudflare is enabled, use `https://devasafetynets.com`.

## 5. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Unstyled HTML | Rebuild Docker image (old CSP cached). Hard-refresh browser (Ctrl+Shift+R). |
| Parked domain page | Fix DNS A record; wait for propagation. |
| `ERR_SSL_PROTOCOL_ERROR` on IP | Use `http://IP:3000`, not `https://`. |
| Images missing | Rebuild image; ensure `public/images` is in the repo. |
