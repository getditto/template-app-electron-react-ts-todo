import { Document } from "@dittolive/ditto";

export type OrderItem = {
    id: String
    saleItem: SaleItem
    createdOnStr: String
    createdOn: Date
}

type SaleItem = {
    _id: String 
    title: String
    imageName: String // this should be temporary in favor of imageToken
    price: Price
}

export enum OrderStatus {
    open = 0, inProcess = 1, processed = 2, delivered = 3, canceled = 4
}

enum TransactionStatus {
    incomplete, inProcess, complete, failed
}

type Price = {
    amount: Number
}

export class Order {
    _id: [String: String]
    deviceId: String
    saleItemIds: {String: String} //[timestamp, saleItemId]
    transactionIds: {String: TransactionStatus}
    //orderItems: [OrderItem]
    createdOn: Date
    status: OrderStatus
    
    //id: String { _id["id"]! }
    //locationId: String { _id["locationId"]! }
    //createdOnStr: String { DateFormatter.isoDate.string(from: createdOn) }
    //get title(): String { String(id.prefix(8)) }

    get isPaid() {
        // assume canceled and non-empty transactions means paid and therefore final
        // N.B. this does not consider refunds or failed transactions
        return this.status === OrderStatus.canceled || Object.keys(this.transactionIds).length !== 0
    }

    constructor (doc: Document) {
        this._id = doc.at('_id').value
        this.deviceId = doc.at('deviceId').value
        this.transactionIds = doc.at('transactionIds').value
        this.saleItemIds = doc.at('saleItemIds').value
        this.createdOn = new Date(doc.at('createdOn').value)
        this.status = doc.at('status').value
    }

}
