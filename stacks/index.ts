import {App} from "@serverless-stack/resources";
import ApiStack from "./ApiStack";

import StorageStack from "./StorageStack";

export default function main(app: App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x"
  });

  /**
   * Create resources needed for the functions.
   */
  const storageStack = new StorageStack(app, "storage", {})

  /**
   * Initialize ApiStack which internally creates lambdas with correct props
   */
  new ApiStack(app, "api", {
    table: storageStack.table
  });

  // Add more stacks
}
