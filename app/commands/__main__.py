from __future__ import annotations

import time
from datetime import datetime


def main():
    # test sub process executable....
    try:
        print("called main()")
        for i in range(50):
            print(f"line[{i:02d}]:", datetime.now())
            time.sleep(0.2)
        print("done!")

    except (Exception, KeyboardInterrupt):
        print("exception!")


if __name__ == "__main__":
    main()
