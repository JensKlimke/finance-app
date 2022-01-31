echo "REACT_APP_BUILD_TAG=${BUILD_TAG}" >> .env
echo "REACT_APP_BUILD_DISPLAY_NAME=${BUILD_DISPLAY_NAME}" >> .env
echo "REACT_APP_BUILD_URL=${BUILD_URL}" >> .env
echo "REACT_APP_BUILD_DATE=`env TZ=Europe/Berlin date`" >> .env
echo "REACT_APP_BRANCH_NAME=${BRANCH_NAME}" >> .env
echo "REACT_APP_GIT_COMMIT=${GIT_COMMIT}" >> .env
