# copying env files
echo "Creating .env files for frontend and backend"
cp ./env_sample/.env.backend.sample ./linkup-backend/.env
cp ./env_sample/.env.frontend.sample ./linkup-frontend/.env
echo "env files created"

echo "installing packages for frontend"
cd ./linkup-frontend
npm install

echo "installing packages for frontend"
cd ../linkup-backend
npm install

cd ..
echo "run npm start in linkup-frontend directory"
echo "run npm dev in linkup-backend directory"
