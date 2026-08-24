# The skill's source of truth is the directory Claude Code actually loads.
# prose-voice.skill is a zip of it, and is gitignored build output.

SKILL_SRC := .claude/skills/prose-voice
SKILL_OUT := prose-voice.skill
SKILL_FILES := $(shell find $(SKILL_SRC) -type f -not -name '.DS_Store')

.PHONY: skill clean

skill: $(SKILL_OUT)

$(SKILL_OUT): $(SKILL_FILES)
	@rm -f $@
	@cd $(dir $(SKILL_SRC)) && zip -qrX $(CURDIR)/$@ $(notdir $(SKILL_SRC)) -x '*.DS_Store'
	@echo "built $@ from $(SKILL_SRC)"

clean:
	@rm -f $(SKILL_OUT)
