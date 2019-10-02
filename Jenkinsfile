//Enables Shared Libraries for usage - visit them at https://gitlab.tyson.com/jenkinspipelines_lib/shared_libraries/
@Library('shared_libraries') _
// Replace demo with your project name for kubernetes pod naming
label = "demo-${UUID.randomUUID().toString()}"

env.DOCKER_IMAGE = "fsv-paycardassignment"
env.DOCKER_DEV_ADDRESS = "cmdb2160-docker-dev-local.artifactory.tyson.com"
env.DOCKER_QA_ADDRESS = "cmdb2160-docker-qa-local.artifactory.tyson.com"
env.DOCKER_PROMOTE_QA = "cmdb2160-docker-qa-local"
env.DOCKER_PROMOTE_PROD = "x"
env.GENERIC_REPO_BASE = "https://www.artifactory.tyson.com/artifactory/cmdb2160-generic-prd-local"
env.GITLAB_CREDENTIALS_ID = "2160-fsvpaycardapp-GITLAB"
env.PIPELINE_APPROVAL = "mike.morrison@tyson.com"
env.DEPLOYMENT_YAML_DEV = "deploymentapp-dev.yaml"
env.DEPLOYMENT_YAML_QA = "deploymentapp-qa.yaml";
env.DEPLOYMENT_YAML_PREPROD = "deploymentapp-qa.yaml";
env.DEPLOYMENT_YAML_PROD = "deploymentapp-prod.yaml";
env.DEPLOY_NAMESPACE = "2160-paycard-assignment-app";
def clusterNameDEV = "eks-entapps-nonprod-dev";
def clusterNameQA = "eks-entapps-nonprod-qa";
def deploymentYamlDEV = "deploymentapp-dev.yaml";
def deploymentYamlQA = "deploymentapp-qa.yaml";
def deployNamespace = "2160-paycard-assignment-app";
def gitlabaddress = 'https://gitlab.tyson.com/MORANANDER00/paycard.git';
def serviceYaml = "x";
env.ARTIFACTORY_BUILD_CREDENTIALS_ID = "build2160"

if (env.DEPLOY_RELEASE_NAME == "BUILD_NEW" && env.gitlabBranch) {
    env.DOCKER_TAG = env.gitlabBranch + "-" + env.BUILD_NUMBER
    if (!env.gitlabBranch.startsWith("release")) {
        env.DEPLOY_ENV_NAME = "DEV"
    } 
    currentBuild.displayName = env.DOCKER_TAG
    podTemplate(label: label,
        containers: [
            // Container used to build/scan your docker image, and sonarqube container used to scan your code
            containerTemplate(name: 'docker', image: 'docker:dind', ttyEnabled: true, command: 'cat'),
            containerTemplate(name: 'sonarqube', image: 'sonarqube:alpine', command: 'cat', args: '', ttyEnabled: true)],
        volumes: [hostPathVolume(hostPath: '/var/run/docker.sock', mountPath: '/var/run/docker.sock')],
    )
    { 
        node(label) {
            stage('Pull from GitLab') {
                // hide gitlab credentials
                    git branch: env.gitlabBranch,
                        credentialsId: env.GITLAB_CREDENTIALS_ID,
                            url: gitlabaddress
            stage('Run SonarQube Scan') {
                try {
                    container('sonarqube') {
                        // Production sonar token
                        withCredentials([string(credentialsId: 'sonarqube-token-prod', variable: 'sonarqubejenkinstoken')])
                        {
                            def scannerHome = tool 'SonarQube 3.2';
                            withSonarQubeEnv('Sonarqube-Prod') {
                                sh """
                                apk add --update nodejs
	                            ${scannerHome}/bin/sonar-scanner -X -Dsonar.projectKey=$DOCKER_IMAGE -Dsonar.sources=. -Dsonar.host.url=https://sonar.tyson.com/ -Dsonar.login=$sonarqubejenkinstoken
	                            """
                            }
                        }
                    }
                }
                catch (exc) {
                    println "Failed to scan with sonarqube - ${currentBuild.fullDisplayName}"
                    throw (exc)
                }
            }
            container('docker') {
                stage('Build Docker Container') {
                    // remember to create build account in artifactory
                    withCredentials([usernamePassword(credentialsId: env.ARTIFACTORY_BUILD_CREDENTIALS_ID, passwordVariable: 'artifactorypassword', usernameVariable: 'artifactoryusername')]) {
                        sh  """
                        apk add --no-cache curl jq python py-pip
                        pip install awscli
                        docker build --network=host -t $DOCKER_DEV_ADDRESS/$DOCKER_IMAGE:$DOCKER_TAG . 
                        docker login -u $artifactoryusername -p $artifactorypassword $DOCKER_DEV_ADDRESS
                        docker push $DOCKER_DEV_ADDRESS/$DOCKER_IMAGE:$DOCKER_TAG
                        """
                        // Attaches your branch name and build number overwriting "IMAGE_TAG" in the deployment yaml
                        sh """
                        sed  -i 's/IMAGE_TAG/'"$DOCKER_TAG"'/g' $deploymentYamlDEV
                        curl -u $artifactoryusername:$artifactorypassword -T $deploymentYamlDEV "$GENERIC_REPO_BASE/$DOCKER_TAG/$deploymentYamlDEV"
                        """
                        // Push your yaml files separately from your container - you will need them to deploy your container 
                    }
                }
                stage("Run AquaSec Scan"){
                    aqua locationType: 'hosted', registry: env.DOCKER_DEV_ADDRESS, hostedImage: env.DOCKER_IMAGE + ':' + env.gitlabBranch + '-' + env.BUILD_NUMBER, notCompliesCmd: '', onDisallowed: 'fail', hideBase: false, showNegligible: false
                }
            }
        }
    }
    }
} else if (!env.gitlabBranch && !env.DEPLOY_RELEASE_NAME.startsWith("release")) {
    currentBuild.displayName = 'failed-' + env.BUILD_NUMBER;
    throw new IllegalArgumentException("Won't build - Could not find branch & Missing redeploy parameters");
}
else {
    currentBuild.displayName = 'Redeploy ' + env.DEPLOY_RELEASE_NAME + ' (' + env.DEPLOY_ENV_NAME + ')';
    env.DOCKER_TAG = env.DEPLOY_RELEASE_NAME;
}

// Preparing Deployment Steps
// You will want four artifactory repos - dev, qa, prod, and generic
// Generic is for your yaml files to deploy your application
def artifactoryRepo = env.GENERIC_REPO_BASE + "/" + env.DOCKER_TAG

deployEKSEntAppsStandard()