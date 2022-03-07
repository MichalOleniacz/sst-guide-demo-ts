import { Api, Stack, StackProps, Table } from "@serverless-stack/resources";
import { Construct } from "constructs";

interface ApiProps extends StackProps {
  table: Table;
}

export default class ApiStack extends Stack {
  public readonly api: Api | undefined;

  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    const { table } = props;

    /**
     * @see {@link https://github.dev/serverless-stack/serverless-stack/tree/6ab25c6672219e5282f34de724fb8c6117064e3a/packages/resources/src/Api.ts}
     */
    this.api = new Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        "POST /notes": "src/create.main",
        "GET /notes/{id}": "src/get.main",
        "GET /notes": "src/list.main",
        "PUT /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
      },
    });

    /**
     * Creates CDK iam.PolicyStatement for all Functions passed in routes based on the argument.
     * If the argument is an instance of a resouce construct (example: Table, EventBus) from sst,
     * which extends the CDK construct, SST creates a policy allowing for "*" on the requestested resource
     *
     * It is possible to use CDK iam.PolicyStatement to create more restrictive policies.
     *
     * @see {@link https://github.com/serverless-stack/serverless-stack/blob/6ab25c6672219e5282f34de724fb8c6117064e3a/packages/resources/src/util/permission.ts#L140}
     * @see {@link https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html}
     * =================
     *
     * TODO: Play around with the CDK PolicyStatement construct to limit permissions attached to the FNs.
     *
     * =================
     */
    this.api.attachPermissions([table]);

    /**
     * Creates a CloudFormation configuration file with this structure:
     *
     *      Outputs: {
     *           [this.logicalId]: {
     *               Description: this._description,
     *               Value: this._value,
     *               Export: this._exportName != null ? { Name: this._exportName } : undefined,
     *               Condition: this._condition ? this._condition.logicalId : undefined,
     *           },
     *       },
     *
     *  where _value is set to the URL of the stack created automatically by the CDK API GatewayV2 construct (HTTP API) inside the Stack class.
     *
     *  @see {@link https://github.dev/serverless-stack/serverless-stack/tree/6ab25c6672219e5282f34de724fb8c6117064e3a/packages/resources/src}
     *  @see {@link https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigatewayv2.CfnApi.html#attrapiendpoint}
     *  @see {@link https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-sam.CfnApi.html}
     *  @see {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html}
     *  @see {@link https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_core.CfnOutput.html}
     *  @see {@link https://github.dev/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-apigatewayv2}
     */
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
