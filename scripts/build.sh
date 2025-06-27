#!/bin/bash

# Script de build para Amplify
echo "Configurando variables de entorno..."

# Si estamos en producción y no hay VITE_APP_HOST, usar la URL de Amplify
if [ "$AWS_APP_ID" != "" ] && [ "$VITE_APP_HOST" = "" ]; then
    echo "VITE_APP_HOST=https://$AWS_APP_ID.amplifyapp.com" >> .env
    echo "Configurado VITE_APP_HOST=https://$AWS_APP_ID.amplifyapp.com"
fi

# Mostrar variables para debug
echo "Variables de entorno disponibles:"
echo "VITE_APP_HOST: $VITE_APP_HOST"
echo "AWS_APP_ID: $AWS_APP_ID"

# Ejecutar build
npm run build 