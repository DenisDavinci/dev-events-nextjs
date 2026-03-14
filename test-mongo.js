const mongoose = require('mongoose');

async function testUri(uri, label) {
    try {
        console.log(`Testing ${label}...`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`✅ Success: ${label}`);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log(`❌ Failed: ${label} - ${err.message}`);
        return false;
    }
}

async function runTests() {
    const uris = [
        { uri: "mongodb+srv://denisdavinci_db_user:dnCs2424@cluster0.1aim0kx.mongodb.net/?appName=Cluster0", label: "Standard URI" },
        { uri: "mongodb+srv://denisdavinci_db_user:dnCs2424@cluster0.1aim0kx.mongodb.net/test?appName=Cluster0", label: "With DB name 'test'" },
        { uri: "mongodb+srv://denisdavinci_db_user:dnCs2424@cluster0.1aim0kx.mongodb.net/dev-events-nextjs?appName=Cluster0", label: "With DB name 'dev-events-nextjs'" },
        { uri: "mongodb+srv://denisdavinci:dnCs2424@cluster0.1aim0kx.mongodb.net/?appName=Cluster0", label: "Username denisdavinci" },
        { uri: "mongodb+srv://<denisdavinci_db_user>:<dnCs2424>@cluster0.1aim0kx.mongodb.net/?appName=Cluster0", label: "Literal angle brackets" }
    ];

    for (const test of uris) {
        await testUri(test.uri, test.label);
    }
    process.exit(0);
}

runTests();
