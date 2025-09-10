import { usT1PromptKit } from "./us_t1";
import { usT2PromptKit } from "./us_t2";
import { oemPromptKit } from "./oem";
import { auctionPromptKit } from "./auction";
import { intlPromptKit } from "./intl";
import { specialtyPromptKit } from "./specialty";
export const domainPromptKitMap = {
    // US Tier-1
    "cars.com": usT1PromptKit,
    "autotrader.com": usT1PromptKit,
    "cargurus.com": usT1PromptKit,
    "carvana.com": usT1PromptKit,
    "carmax.com": usT1PromptKit,
    "edmunds.com": usT1PromptKit,
    "kbb.com": usT1PromptKit,
    "truecar.com": usT1PromptKit,
    // US Tier-2
    "facebook.com": usT2PromptKit,
    "craigslist.org": usT2PromptKit,
    "offerup.com": usT2PromptKit,
    // OEM
    "toyota.com": oemPromptKit,
    "ford.com": oemPromptKit,
    // Auction
    "manheim.com": auctionPromptKit,
    "copart.com": auctionPromptKit,
    // Intl
    "autoscout24.com": intlPromptKit,
    "mobile.de": intlPromptKit,
    // Specialty
    "bringatrailer.com": specialtyPromptKit,
    "hemmings.com": specialtyPromptKit,
    "carsandbids.com": specialtyPromptKit
};
