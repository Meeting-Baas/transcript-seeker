# Quickstart: Deploy the Transcript Seeker Service to Cloud Run

Learn how to create and deploy the Transcript Seeker service, package it into a container image, upload it to Artifact Registry, and deploy it to Cloud Run.


### Before you Begin



In the Google Cloud console, on the project selector page, select or create a Google Cloud project.

> **Note**: If you don't plan to keep the resources that you create in this procedure, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project.

[Go to project selector](https://console.cloud.google.com/projectselector2/home/dashboard)

Make sure that billing is enabled for your Google Cloud project.

Install the Google Cloud CLI.
To initialize the gcloud CLI, run the following command:

```bash
gcloud init
```

> **Note**: If you installed the gcloud CLI previously, make sure you have the latest version by running:

```bash
gcloud components update
```

To set the default project for your Cloud Run service:

```bash
gcloud config set project PROJECT_ID
```

Replace `PROJECT_ID` with your Google Cloud project ID.

If you are under a domain restriction organization policy restricting unauthenticated invocations for your project, you will need to access your deployed service as described under Testing private services.

### Enable Required APIs

Enable the Cloud Run Admin API and the Cloud Build API:

```bash
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com
```

After the Cloud Run Admin API is enabled, the Compute Engine default service account is automatically created.

For Cloud Build to be able to build your sources, grant the Cloud Build Service Account role to the Compute Engine default service account by running the following:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member=serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder
```

Replace `PROJECT_NUMBER` with your Google Cloud project number, and `PROJECT_ID` with your Google Cloud project ID. For detailed instructions on how to find your project ID and project number, see [Creating and managing projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects).

> **Note**:
> The `iam.automaticIamGrantsForDefaultServiceAccounts` organization policy constraint prevents the Editor role from being automatically granted to default service accounts. If you created your organization after May 3, 2024, this constraint is enforced by default.
>
> We strongly recommend that you enforce this constraint to disable the automatic role grant. If you disable the automatic role grant, you must decide which roles to grant to the default service accounts, and then grant these roles yourself.
>
> If the default service account already has the Editor role, we recommend that you replace the Editor role with less permissive roles. To safely modify the service account's roles, use Policy Simulator to see the impact of the change, and then grant and revoke the appropriate roles.

### 3. Prepare Your Environment

Install dependencies if not done already:

```bash
pnpm install
```

Copy over the environment variables:

```bash
cp .env.example .env.development.local
export NODE_ENV=development
```

Build the project:

```bash
pnpm build
```

### Deploy to Cloud Run from Source

> **Important**: This quickstart assumes that you have owner or editor roles in the project you are using for the quickstart. Otherwise, refer to the Cloud Run Source Developer role for the required permissions for deploying a Cloud Run resource from source.

Deploy from source automatically builds a container image from source code and deploys it.

To deploy from source:

In your source code directory, deploy the current folder using the following command:

```bash
gcloud run deploy --source .
```

When you are prompted for the service name, press Enter to accept the default name, for example `helloworld`.

If you are prompted to enable additional APIs on the project, for example, the Artifact Registry API, respond by pressing `y`.

When you are prompted for region: select the region of your choice, for example `us-central1`.

If you are prompted to create a repository in the specified region, respond by pressing `y`.

If you are prompted to allow unauthenticated invocations: respond `y`. You might not see this prompt if there is a domain restriction organization policy that prevents it; for more details see the Before you begin section.

Then wait a few moments until the deployment is complete. On success, the command line displays the service URL.

Visit your deployed service by opening the service URL in a web browser.

Congratulations! You have successfully deployed the Transcript Seeker service from source code to Cloud Run. Cloud Run automatically and horizontally scales out your container image to handle the received requests, then scales in when demand decreases. You only pay for the CPU, memory, and networking consumed during request handling.

Now when it fails re create a new thing same name set env yay worked

### Clean Up

#### Remove your Test Project

While Cloud Run does not charge when the service is not in use, you might still be charged for storing the container image in Artifact Registry. You can delete your container image or delete your Google Cloud project to avoid incurring charges. Deleting your Google Cloud project stops billing for all the resources used within that project.

> **Caution**: Deleting a project has the following effects:
> - Everything in the project is deleted. If you used an existing project for the tasks in this document, when you delete it, you also delete any other work you've done in the project.
> - Custom project IDs are lost. When you created this project, you might have created a custom project ID that you want to use in the future. To preserve the URLs that use the project ID, such as an `appspot.com` URL, delete selected resources inside the project instead of deleting the whole project.

In the Google Cloud console, go to the [Manage resources page](https://console.cloud.google.com/cloud-resource-manager).

In the project list, select the project that you want to delete, and then click **Delete**.
In the dialog, type the project ID, and then click **Shut down** to delete the project.

### Credits

This guide was adapted from the official Google Cloud documentation for deploying services to Cloud Run. Content is licensed under the Creative Commons Attribution 4.0 License. For more details, refer to the original [Google Developers Site Policies](https://developers.google.com/site-policies). 

