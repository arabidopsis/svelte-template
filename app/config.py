from __future__ import annotations

APP_NAME = "Svelte App"
# use fontawesome css fonts
FONT_ICONS = True
# unexpected bugs that result in Internal Server Error 50x
# will be emailed to here if set:
# ADMINS = ['your.email@gmail.com']
MAIL_SUBJECT = "svelte website"
MAIL_SERVER = "mailhost"
# don't send more than 1 error email message every 5 mins
# LOG_ERROR_DELAY = 60 * 5

# for html header <meta>
SITE_URL = "https://mysite.url"

# where svelte/esbuild writes it's js/css files in the static folder
ASSET_FOLDER = "assets"
