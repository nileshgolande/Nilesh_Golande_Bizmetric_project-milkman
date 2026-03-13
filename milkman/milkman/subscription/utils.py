from datetime import date, timedelta
from .models import Subscription


def next_valid_delivery_date(sub: Subscription, from_date: date | None = None) -> date:
    d = from_date or date.today()
    while True:
        if not sub.is_active:
            return d
        paused = sub.pauses.filter(date=d).exists()
        if not paused:
            return d
        d = d + timedelta(days=1)
