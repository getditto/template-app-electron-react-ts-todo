import { Ditto, IdentityOnlinePlayground, QueryObservationHandler, Subscription } from '@dittolive/ditto'

const APP_ID = 'b2e901f8-9cee-4cdd-8d8a-2e58452debb2'
const TOKEN = '12a01e0d-4cfc-45e8-8e43-91baac9071ad'
const PATH = 'ditto'

let manager: DittoManager

// Used to constrain orders subscriptions to 1 day old or newer
let OrderTTL: number = 1 // 1 day

class DittoManager {
    ditto: Ditto
    locationsSubscription: Subscription
    ordersSubscription: Subscription
    transactionsSubscription: Subscription
    locationId: string = 'DittoLicious-1234'

    constructor (ditto: Ditto) {
        this.ditto = ditto

        ditto.startSync()

        this.locationsSubscription = ditto.store.collection("locations").findAll().subscribe()
        //initial subscription query will find zero matches
        this.ordersSubscription = ditto.store.collection("orders").find(this.ordersQuerySinceTTL(this.locationId)).subscribe()
        this.transactionsSubscription = ditto.store.collection("transactions").findAll().subscribe()
    }

    observeOpenOrders(cb: QueryObservationHandler) {
        return this.ditto.store.collection('orders').find(this.ordersQuerySinceTTL(this.locationId) + " && (status == 0 || status == 1)").sort("createdOn", 'descending').observeLocal(cb)
    }

    ordersQuerySinceTTL(locId: String): string {
        let date = new Date()
        return `_id.locationId == '${locId}' && createdOn > '${date.setDate(date.getDate() - OrderTTL)}'`
    }
    
}

export default function get(): DittoManager {
  if (!manager) {
    const identity: IdentityOnlinePlayground = {
      type: 'onlinePlayground',
      appID: APP_ID,
      token: TOKEN
    }
    let ditto = new Ditto(identity, PATH)
    manager = new DittoManager(ditto)
    window.onbeforeunload = (e) => {
        ditto.close()
    }
  }
  return manager
}

