import { Bucket, Stack, StackProps, Table, TableFieldType } from "@serverless-stack/resources";
import { Construct } from "constructs";

export default class StorageStack extends Stack {
    
    public readonly table: Table;
    public readonly bucket: Bucket;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.table = new Table(this, "Notes", {
            fields: {
                userId: TableFieldType.STRING,
                noteId: TableFieldType.STRING
            },
            primaryIndex: {
                partitionKey: "userId",
                sortKey: "noteId"
            }
        });

        this.bucket = new Bucket(this, "Uploads");
    }
}