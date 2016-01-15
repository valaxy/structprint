var fs = require('fs-extra')

module.exports = {
	matchOnFileRelativePath: [
		'test',
		'test/**/*'
	],

	tasks: [{
		name                   : 'copy',
		description            : 'Copy resource',
		isEnabled              : true,
		program                : function (info) {
			var outputPath = `${info.projectPath}/dest/${info.dirRelativePath}/${info.fileNameWithoutAllExtensions}${info.fileAllExtensions}`
			fs.copySync(info.filePath, outputPath)
		},
		matchOnFileRelativePath: [
			'**/*.html'
		]
	}]
}