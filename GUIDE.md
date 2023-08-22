# Complete Guide

In this guide you'll find the process of setting up a fullstack ui5 and cap project from scratch.

## 📚 Content  
1. [Log in to SAP](#log-in-to-sap)
1. [Set up the development space on BAS](#setting-up-the-development-space-on-business-application-studiobas)
1. [Clone the project](#clone-the-project)
1. [Deploying the project](#deploy-the-project)

## 🔍 Guide

### Log in to SAP
If you already have an account you can log in to sap and begin the process by [setting up the dev space on BAS](#setting-up-the-development-space-on-business-application-studiobas)

otherwise continue by [creating a new SAP account](#create-a-new-sap-account) or [setup your deloitte user account]()

### Create a new SAP account

If you don't have an account we'll need to create one otherwise [start setting up your development space](#setting-up-the-development-space-on-business-application-studiobas). Go to [sap's website](https://www.sap.com/)

<img src="https://i.imgur.com/W4mf0hr.png" alt="go to login page" width="700" />

Write your details

<img src="https://i.imgur.com/vAADF4Z.png" alt="fill in details" width="700" />

Find the email you've been sent and once you open the link, come up with a good password.

<img src="https://i.imgur.com/mF1y1GD.png" alt="set password" width="700" />

Then we'll [log in to BTP](https://account.hanatrial.ondemand.com/) to use the web development tools provided by SAP.

<img src="https://i.imgur.com/RaAHiZg.png" alt="login to btp" width="700" />

Select your region of choice.

<img src="https://i.imgur.com/TKc1hJU.png" alt="select your region" width="700" />

Lastly, open cockpit. Here you'll find everything you need to develop enterprise grade web applications with SAP.

<img src="https://i.imgur.com/kVGSx2G.png" alt="open cockpit" />

### Setting up the development space on Business Application Studio(BAS)

BAS is a VSCode like development environment where everything is precustomized to make it easier to program BTP Applications. You can find it located in the Quick Access section of the [hana trial website](https://account.hanatrial.ondemand.com/) is the Business Application Studio (BAS).

<img src="https://i.imgur.com/hYoKWLO.png" alt="open business application studio" width="700" />

When you open BAS you'll see your list of dev-spaces. If you don't have any create a new one by pressing the "Create Dev Space" button.

<img src="https://i.imgur.com/eIQFWQq.png" alt="create dev space" width="700" />

Write the name, select "Full Stack Cloud Application" and press "Create Dev Space".

<img src="https://i.imgur.com/zuXnmHk.png" alt="complete dev space creation" width="700" />

Start the Dev Space and open it by clicking on the name for us to begin working on the project.

<img src="https://i.imgur.com/q29eZpm.png" alt="start dev space" width="700" />

---

#### Clone the project
If you want to get up to speed and skip to the deployment process. You can copy the github project by:

Opening the terminal clicking on the top left hamburger menu and navigating to ``View > Terminal`` or pressing ``CTRL + ` `` to open the terminal

Navigate to the projects folder if not already

```console
$ cd projects
```

Clone the project

```console
$ git clone https://github.com/pafliasT/fs_toDoList.git todolistApp
```

We can then open the cloned project by clicking open project and navigate to the project folder.

<img src="https://i.imgur.com/H5Qp8L6.png" alt="open project" width="700" />
<img src="https://i.imgur.com/9g4gutd.png" alt="select folder" width="700" />

Install the necessary dependencies by writing in the terminal

```console
$ npm install
```

And continue by [deploying the project](#deploy-the-project)

### Deploy the project

Deploying the project can be broken down in three steps:
1. [Create the database](#create-the-database)
2. [Prepare the prject](#prepare-the-project)
3. Create the cloud foundry application

#### Create the database

We will setup the database first by opening up cockpit's development space. Go to your subaccount, called trial. On the left ribbon, press on spaces and select the development space called dev. Here we can see all applications deployed in this development space, databases and much more

<img src="https://i.imgur.com/z6AF7bE.png" alt="open dev space" width="800" />

To create a new database, click on the left navigation on SAP Hana Cloud and on the blue create button select SAP Hana Database.

<img src="https://imgur.com/yougOzL.png" alt="create hana database" width="800" />

First we need to select the type of database we want to create. 
The two options are SAP HANA Database and Data Lake:
- SAP HANA Database is the preselected option, it's an efficient database with a [multi-model approach](https://en.wikipedia.org/wiki/Database_model) storing data in-memory. 
- Data Lake is able to store and analyze structured data up to unstructured data.

We need to make sure we've selected the SAP HANA Database option and press next step. Here we'll provide the general information of our database.

Write a name for your database and a strong password and press next step.

<img src="https://imgur.com/g4ErAhv.png" alt="create db step 1 & 2" width="800" />

Now we can specify the total size of our database, the default is more than enough for this project.

Considering you have a trial account on the next step you won't see any options available. 

<img src="https://imgur.com/Py2BwQz.png" alt="create db step 3 & 4" width="800" />

Next we need to specify who can access the database. as this is a test project, we don't need to worry about who can access the database. So allowing all IP addresses will save us some time and hassle in the process.

<img src="https://imgur.com/eKzeDbV.png" alt="create db step 5 & 6" width="800" />

Lastly we can check every detail of the database. If everything looks good we can press on Create Instance.

<img src="https://imgur.com/zw8ddD6.png" alt="create db finalize" width="800" />

#### Prepare the project

We can begin preparing the project by installing all dependencies if we haven't already as well as installing the tools we need.

Open the console and type the following commands.

```console
$ npm i
$ npm i -g @sap/cds-dk
$ npm -g @sap/cds
$ npm i -g mbt
```

We also need to login to cloud foundry, where our applications will be uploaded.

```console
$ cf login
```

Once you press enter you'll be asked to log in with your SAP credentials.
In this step you might encounter a problem with the API endpoint
- You're requested to specify an API endpoint, or
- The API endpoint is different from the one specified in your subaccount's overview page under the Cloud Foundry section. 

You'll need to find the API endpoint by navigating to your subaccount named trial.
<img src="https://imgur.com/rqYphqa.png" alt="check api endpoint" width="800" />

If you encountered the first issue, you just need to specify the api endpoint and continue. Otherwise complete the login and use the following command and replace [URL] with the url you're given.

```console
$ cf api [URL]
```

Continue by setting up cf with the necessary plugins.

```console
$ cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org
$ cf install-plugin multiapps
```
If the second command asks you if you want to uninstall the existing plugin, write ``y`` on the terminal.


The following commands specify what technologies will be used.

```console
$ cds add hana --for production
$ cds add xsuaa --for production
$ cds add mta
$ cds add approuter --for production
```

To complete our preparation we need to update our package-lock to ensure everything is up to date.
```console
$ npm update --package-lock-only
```

#### Build and run the project

Build
```console
$ cds build --production
$ mbt build -t gen --mtar mta.tar
```

Deploy
```console
$ cf deploy gen/mta.tar
```

Ensure once the deploy command completes that you can see the success message.

If you see a problem with the deployment use the `cf dmol` command that the message gives you to download and check the logs. Once you run the command a new folder will appear with the logs.

<img src="https://i.imgur.com/8rlDuOK.png" alt="process failed" />

Within the OPERATION.log where the general logs are, search for errors to find which application failed. Once you find the application find in it's log file what the error is. Disk memory based errors, which is what we encountered, can be solved by increasing the disk size of the specific application.
The disk size can be altered inside the `mta.yaml` file. Which holds configuration settings for building and deploying.

Now that we've deployed the application we need to create the service key to access the database and bind it to establish a connection between the service and the CAP application.
```console
$ cf create-service-key toDoList-db toDoList-db-key
$ cds bind --to toDoList-db:toDoList-db-key
```

After that we're free to run our application with hana which is deployed in Cloud Foundry.
```console
$ npm run start
```