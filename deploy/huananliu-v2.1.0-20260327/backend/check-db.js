const { Service } = require('./models');

async function check() {
  const services = await Service.findAll({ raw: true });
  console.log('数据库原始数据:');
  console.log(services);
}

check();
