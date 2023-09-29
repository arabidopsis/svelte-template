from __future__ import annotations

APP_NAME = "Svelte App"
# update version for js/css cache busting
VERSION = 1
# use fontawesome css fonts
FONT_ICONS = True
# unexpected bugs that result in Internal Server Error 50x
# will be emailed to here if set:
# ADMINS = ['your.email@gmail.com']
MAIL_SUBJECT = "svelte website"
# SMTP mailserver
MAIL_SERVER = "mailhost"
# don't send more than 1 error email message every 5 mins
LOG_ERROR_DELAY = 60 * 5

# for html header <meta> see templates/fragments/meta.html and errors/404.html
SITE_URL = "https://mysite.url"

# where svelte/esbuild writes its js/css/map files in the static folder
# see also the .env file.
ASSET_FOLDER = "assets"

BASE_TEMPLATE = "base.html"
