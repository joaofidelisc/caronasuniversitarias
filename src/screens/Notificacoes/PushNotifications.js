const sendSingleDeviceNotification = data => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'key=AAAAFrUbP_c:APA91bHWUpnHEgGUrHl0ZhJDOlAdF1cJSlZYbwlo5avmuybQH6aHDgKlLeesxtm2NgYNNXeKm6Z4vd-Ue9HMaBsgBkANPiK4rPYpwiGHs60Uz-a3vA0k9DvPihr-MQMU2fNHIjrBONZi',
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
  export default {
    sendSingleDeviceNotification
  };