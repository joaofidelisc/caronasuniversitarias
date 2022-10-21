const sendSingleDeviceNotification = data => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'key=AAAAFrUbP_c:APA91bF2DT57MOfvUpxQ8LssON34_XQuQIBhQoT5TgV16LqjyV8lXy-vIemf8DhvEN4t-AhM0bgMYDoFUD7wTKlE2-4TqD7Jnyr8k6z2M5tLmaQQCrMjaAryYC8QJb0JcyCKHs9VG0x3',
    );
  
    var raw = JSON.stringify({
      data: {},
      notification: {
        body: data.body,
        title: data.title,
      },
      to: data.token,
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  
  const sendMultiDeviceNotification = data => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'key=AAAAFrUbP_c:APA91bF2DT57MOfvUpxQ8LssON34_XQuQIBhQoT5TgV16LqjyV8lXy-vIemf8DhvEN4t-AhM0bgMYDoFUD7wTKlE2-4TqD7Jnyr8k6z2M5tLmaQQCrMjaAryYC8QJb0JcyCKHs9VG0x3',
    );
  
    var raw = JSON.stringify({
      data: {},
      notification: {
        body: data.body,
        title: data.title,
      },
      registration_ids: data.token,
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };
  
  export default {
    sendSingleDeviceNotification,
    sendMultiDeviceNotification,
  };