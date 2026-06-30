const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace property name
    content = content.replace(/verification_status/g, 'onboarding_status');
    
    // Replace string literals
    content = content.replace(/onboarding_status === 'approved'/g, "onboarding_status === 'APPROVED'");
    content = content.replace(/onboarding_status === "approved"/g, 'onboarding_status === "APPROVED"');
    content = content.replace(/onboarding_status !== "approved"/g, 'onboarding_status !== "APPROVED"');
    content = content.replace(/onboarding_status !== 'approved'/g, "onboarding_status !== 'APPROVED'");
    
    content = content.replace(/onboarding_status === 'pending'/g, "onboarding_status === 'REGISTERED'");
    content = content.replace(/onboarding_status === "pending"/g, 'onboarding_status === "REGISTERED"');
    content = content.replace(/onboarding_status !== "pending"/g, 'onboarding_status !== "REGISTERED"');
    content = content.replace(/onboarding_status !== 'pending'/g, "onboarding_status !== 'REGISTERED'");
    
    content = content.replace(/onboarding_status: "pending"/g, 'onboarding_status: "REGISTERED"');
    content = content.replace(/onboarding_status: 'pending'/g, "onboarding_status: 'REGISTERED'");
    
    // Special case for Trust Engine
    content = content.replace(/onboarding_status === 'APPROVED'/g, "onboarding_status === 'APPROVED'"); // Ensure no double replace
    
    // Any remaining 'approved' as value for onboarding_status
    content = content.replace(/, "approved"\)/g, ', "APPROVED")');
    content = content.replace(/, 'approved'\)/g, ", 'APPROVED')");

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
