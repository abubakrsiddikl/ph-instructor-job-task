# #!/usr/bin/env bash 
# set -euo pipefail 


# pnpm install --frozen-lockfile 

# pnpm prisma db update --yes || true


# pnpm run deploy

#!/usr/bin/env bash 
set -euo pipefail 


pnpm install --frozen-lockfile 


pnpm prisma db update --yes || true


pnpm run build
